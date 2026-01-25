package modbus

import (
	"fmt"
	"io"
	stdlog "log"

	"github.com/sirupsen/logrus"
)

// ToStdLogger converts logrus.FieldLogger into *log.Logger in one call.
// It uses logrus's built-in WriterLevel (so formatter/hooks apply).
// IMPORTANT: call the returned closer.Close() when you no longer need the logger.
func ToStdLogger(l logrus.FieldLogger, level logrus.Level, prefix string, flags int) (*stdlog.Logger, io.Closer, error) {
	if l == nil {
		return nil, nil, fmt.Errorf("nil FieldLogger")
	}

	type writerLeveler interface {
		WriterLevel(level logrus.Level) *io.PipeWriter
	}
	wl, ok := any(l).(writerLeveler)
	if !ok {
		return nil, nil, fmt.Errorf("FieldLogger %T does not support WriterLevel (need *logrus.Logger or *logrus.Entry)", l)
	}

	pw := wl.WriterLevel(level) // goes through formatter + hooks
	return stdlog.New(pw, prefix, flags), pw, nil
}
