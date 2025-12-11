package core

import (
	"crypto/tls"
	"net"

	"github.com/fluxionwatt/gridbeat/http"
	"github.com/gofiber/fiber/v3"
	mqtt "github.com/mochi-mqtt/server/v2"
	"github.com/sirupsen/logrus"
	"github.com/spf13/viper"
)

func ServerHTTP(server *mqtt.Server, errorLogger *logrus.Logger, accessLogger *logrus.Logger) {

	app, err := http.NewHandler(server, errorLogger, accessLogger)
	if err != nil {
		errorLogger.Fatal(err)
	}

	http.RouterGroupApp.Auth.InitRouter(app)
	http.RouterGroupApp.System.InitRouter(app)

	if !Gconfig.HTTPS.Disable {
		go func() {

			cert, _ := tls.X509KeyPair([]byte(certPEM), []byte(keyPEM))

			tlsConf := &tls.Config{
				Certificates: []tls.Certificate{cert},
				MinVersion:   tls.VersionTLS12,
			}

			ln, err := tls.Listen("tcp", ":"+viper.GetString("https.port"), tlsConf)
			if err != nil {
				errorLogger.Fatal("tls listen failed: ", err)
			}

			if err := app.Listener(ln, fiber.ListenConfig{
				DisableStartupMessage: true,
				TLSMinVersion:         tls.VersionTLS12,
			}); err != nil {
				errorLogger.Fatal(err)
			}
		}()
	}

	// 3. 创建 HTTP listener（明文）
	lnHTTP, err := net.Listen("tcp", ":"+viper.GetString("http.port"))
	if err != nil {
		errorLogger.Fatal("http listen failed: ", err)
	}

	if err := app.Listener(lnHTTP, fiber.ListenConfig{
		DisableStartupMessage: true,
	}); err != nil {
		errorLogger.Fatal("http app.Listener failed: ", err)
	}
}
