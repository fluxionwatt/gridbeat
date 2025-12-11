package core

import (
	"context"
	"log/slog"

	mqtt "github.com/mochi-mqtt/server/v2"
	"github.com/mochi-mqtt/server/v2/hooks/auth"
	"github.com/mochi-mqtt/server/v2/listeners"
	"github.com/sirupsen/logrus"
)

func ServerMQTT(mqttLogger *logrus.Logger) (*mqtt.Server, error) {
	server := mqtt.New(&mqtt.Options{
		InlineClient: true,
	})

	server.Log = slog.New(NewLogrusHandler(mqttLogger))

	_ = server.AddHook(new(auth.AllowHook), nil)

	if err := server.AddListener(listeners.NewTCP(listeners.Config{ID: "t1", Address: ":1883"})); err != nil {
		return nil, err
	}

	return server, nil
}

type LogrusHandler struct {
	logger *logrus.Logger
	attrs  []slog.Attr
}

func NewLogrusHandler(l *logrus.Logger) slog.Handler {
	return &LogrusHandler{logger: l}
}

func (h *LogrusHandler) Enabled(ctx context.Context, lvl slog.Level) bool {
	// 可以按需做 level 过滤，这里简单全开
	return true
}

func (h *LogrusHandler) Handle(ctx context.Context, r slog.Record) error {
	fields := logrus.Fields{}

	// 继承的 attrs
	for _, a := range h.attrs {
		fields[a.Key] = a.Value.Any()
	}

	// 本条日志的 attrs
	r.Attrs(func(a slog.Attr) bool {
		fields[a.Key] = a.Value.Any()
		return true
	})

	entry := h.logger.WithFields(fields)

	switch {
	case r.Level <= slog.LevelDebug:
		entry.Debug(r.Message)
	case r.Level <= slog.LevelInfo:
		entry.Info(r.Message)
	case r.Level <= slog.LevelWarn:
		entry.Warn(r.Message)
	default:
		entry.Error(r.Message)
	}

	return nil
}

func (h *LogrusHandler) WithAttrs(attrs []slog.Attr) slog.Handler {
	newAttrs := make([]slog.Attr, 0, len(h.attrs)+len(attrs))
	newAttrs = append(newAttrs, h.attrs...)
	newAttrs = append(newAttrs, attrs...)
	return &LogrusHandler{
		logger: h.logger,
		attrs:  newAttrs,
	}
}

func (h *LogrusHandler) WithGroup(name string) slog.Handler {
	// 简单实现：不额外处理 group，按需可以给 key 加前缀
	return h
}
