package http

import (
	"time"

	"github.com/fluxionwatt/gridbeat/version"
	"github.com/gofiber/fiber/v3"
	"github.com/shirou/gopsutil/v4/cpu"
	"github.com/shirou/gopsutil/v4/host"
	"github.com/shirou/gopsutil/v4/mem"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

type SystemRouter struct{}

func (s *SystemRouter) InitRouter(app *fiber.App) {

	v1 := app.Group("/v1/api", func(c fiber.Ctx) error {
		c.Set("Version", "v1")
		return c.Next()
	})

	v1.Get("/system/version", Version)
	v1.Get("/maintenance/overview", MaintenanceOverview)
}

func Version(c fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"productName": version.ProductName,
		"Version":     version.Version,
		"buildTime":   version.BUILDTIME,
		"gitCommit":   version.CommitSHA,
		"copyright":   "© 2025 Your Company. All rights reserved.",
		"extra":       "版本信息",
	})
}

func MaintenanceOverview(c fiber.Ctx) error {

	//log := GetLogger(c)

	s, _ := host.Uptime()

	_, _ = cpu.Percent(time.Second, false)
	percentages, _ := cpu.Percent(time.Second, false)
	cpuUsed := percentages[0]

	v, err := mem.VirtualMemory()
	if err != nil {
		return fiber.ErrBadRequest
	}

	data := fiber.Map{
		"uptimeSeconds": s,
		"cpuUsage":      cpuUsed,
		"memUsage":      v.UsedPercent,
		"services": []fiber.Map{
			fiber.Map{"name": "Modbus", "status": "up"},
			fiber.Map{"name": "MQTT", "status": "down"},
			fiber.Map{"name": "Northbound", "status": "degraded"},
		},
	}
	return c.JSON(data)
}

func GetLogger(c fiber.Ctx) *logrus.Logger {
	v := c.Locals("logger")
	if v == nil {
		return nil
	}
	deps, _ := v.(*logrus.Logger)
	return deps
}

func GetDB(c fiber.Ctx) *gorm.DB {
	v := c.Locals("db")
	if v == nil {
		return nil
	}
	deps, _ := v.(*gorm.DB)
	return deps
}
