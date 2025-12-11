package cmd

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/signal"
	"path/filepath"
	"sync"
	"syscall"
	"time"

	"github.com/fluxionwatt/gridbeat/core"
	"github.com/fluxionwatt/gridbeat/model"
	mqtt "github.com/mochi-mqtt/server/v2"
	"github.com/sevlyar/go-daemon"
	"github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var (
	accesslogPath = "access.log"
	runlogPath    = "run.log"
	mqttlogPath   = "mqtt.log"
	sqllogPath    = "sql.log"

	accesslogPathFile *os.File
	runlogPathFile    *os.File
	mqttlogPathFile   *os.File
	sqllogPathFile    *os.File

	accessLogger = logrus.New()
	runLogger    = logrus.New()
	mqttLogger   = logrus.New()
	sqlLogger    = logrus.New()
	logMu        sync.Mutex
)

func initLoggers() error {
	logMu.Lock()
	defer logMu.Unlock()

	// 关闭旧的
	if accesslogPathFile != nil {
		_ = accesslogPathFile.Close()
	}
	if runlogPathFile != nil {
		_ = runlogPathFile.Close()
	}
	if mqttlogPathFile != nil {
		_ = mqttlogPathFile.Close()
	}
	if sqllogPathFile != nil {
		_ = sqllogPathFile.Close()
	}

	var err error

	if accesslogPathFile, err = os.OpenFile(core.Gconfig.LogPath+"/"+accesslogPath, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0o644); err != nil {
		return err
	}
	if runlogPathFile, err = os.OpenFile(core.Gconfig.LogPath+"/"+runlogPath, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0o644); err != nil {
		return err
	}
	if mqttlogPathFile, err = os.OpenFile(core.Gconfig.LogPath+"/"+mqttlogPath, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0o644); err != nil {
		return err
	}
	if sqllogPathFile, err = os.OpenFile(core.Gconfig.LogPath+"/"+sqllogPath, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0o644); err != nil {
		return err
	}

	accessLogger.SetOutput(accesslogPathFile)
	accessLogger.SetFormatter(&AccessLogJSONFormatter{})

	runLogger.SetOutput(runlogPathFile)
	runLogger.SetFormatter(&logrus.JSONFormatter{})
	if core.Gconfig.Debug {
		runLogger.SetLevel(logrus.DebugLevel)
		runLogger.ReportCaller = true
	}

	mqttLogger.SetOutput(mqttlogPathFile)
	mqttLogger.SetFormatter(&logrus.JSONFormatter{})
	if core.Gconfig.Debug {
		mqttLogger.SetLevel(logrus.DebugLevel)
		mqttLogger.ReportCaller = true
	}

	sqlLogger.SetOutput(sqllogPathFile)
	sqlLogger.SetFormatter(&logrus.JSONFormatter{})
	if core.Gconfig.Debug {
		sqlLogger.SetLevel(logrus.DebugLevel)
		sqlLogger.ReportCaller = true
	}

	return nil
}

func init() {
	rootCmd.AddCommand(serverCmd)
	rootCmd.AddCommand(serverStopCmd)

	flags := serverCmd.Flags()
	flags.BoolVarP(&core.Gconfig.Daemon, "daemon", "d", false, "run as daemon process")
	flags.BoolVar(&core.Gconfig.DisableAuth, "disable_auth", false, "disable http api auth")

	viper.BindPFlag("daemon", serverCmd.Flags().Lookup("daemon"))
}

type AccessLogJSONFormatter struct{}

func (f *AccessLogJSONFormatter) Format(entry *logrus.Entry) ([]byte, error) {
	// 只用自定义字段，不要内置字段
	data := make(map[string]interface{}, len(entry.Data))

	// 拷贝自己的字段（WithField/WithFields 设置的）
	for k, v := range entry.Data {
		data[k] = v
	}

	data["time"] = entry.Time.Format("02/Jan/2006:15:04:05 -0700")

	b, err := json.Marshal(data)
	if err != nil {
		return nil, err
	}
	return append(b, '\n'), nil
}

var serverStopCmd = &cobra.Command{
	Use:   "stop",
	Short: "stop running server",
	Long:  ``,
	RunE: func(cmd *cobra.Command, args []string) error {

		cwd, _ := os.Getwd()

		pidFile := filepath.Join(cwd, "gridbeat.pid")

		cntxt := &daemon.Context{
			PidFileName: pidFile,
			PidFilePerm: 0644,
		}

		proc, err := cntxt.Search()
		if err != nil {
			return fmt.Errorf("daemon not running or pidfile missing: %w", err)
		}

		// 给进程发 SIGTERM
		if err := proc.Signal(syscall.SIGTERM); err != nil {
			return err
		}

		fmt.Println("daemon stopping...")

		return nil
	},
}

var serverCmd = &cobra.Command{
	Use:   "server",
	Short: "run server",
	Long:  ``,
	RunE: func(cmd *cobra.Command, args []string) error {

		cntxt := &daemon.Context{
			PidFileName: "gridbeat.pid",
			PidFilePerm: 0644,
			LogFileName: "",
			LogFilePerm: 0640,
			WorkDir:     "./",
			Umask:       027,
			Args:        nil,
		}

		if core.Gconfig.Daemon {
			var child *os.Process
			var err error

			if child, err = cntxt.Reborn(); err != nil {
				log.Fatal("Unable to run: ", err)
			}
			if child != nil {
				return nil
			}
			defer cntxt.Release()
		}

		var err error
		if err = initLoggers(); err != nil {
			panic(err)
		}

		if err = model.InitDB(core.Gconfig.DataPath+"/app.db", sqlLogger); err != nil {
			runLogger.Fatal(err)
		}

		// 创建信号用于等待服务端关闭信号
		sigs := make(chan os.Signal, 1)
		done := make(chan bool, 1)
		signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM)
		go func() {
			<-sigs
			done <- true
		}()

		time.Sleep(10 * time.Second)

		// mqtt
		var server *mqtt.Server
		if server, err = core.ServerMQTT(mqttLogger); err != nil {
			mqttLogger.Fatal(err)
			return err
		}
		if err := server.Serve(); err != nil {
			mqttLogger.Fatal(err)
			return err
		}

		go core.ServerHTTP(server, runLogger, accessLogger)

		go core.ServerPlugins(server, runLogger)

		// 服务端等待关闭信号
		<-done

		// 关闭服务端时需要做的一些清理工作

		return nil
	},
}
