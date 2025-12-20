package api

import (
	"strconv"

	"github.com/fluxionwatt/gridbeat/internal/models"
	"github.com/fluxionwatt/gridbeat/internal/response"
	"github.com/gofiber/fiber/v3"
	"gorm.io/gorm"
)

func registerSerialRoutes(v1 fiber.Router, gdb *gorm.DB) {
	// GET /api/v1/serials - list all serial records / 获取所有串口记录
	v1.Get("/serials", func(c fiber.Ctx) error {
		var rows []models.Serial
		if err := gdb.Order("device asc").Find(&rows).Error; err != nil {
			return response.Fail(c, fiber.StatusInternalServerError, 20001, "db error")
		}
		return response.OK(c, rows)
	})

	// GET /api/v1/serials/:id - get one / 获取单条记录
	v1.Get("/serials/:id", func(c fiber.Ctx) error {
		id, err := strconv.ParseUint(c.Params("id"), 10, 64)
		if err != nil {
			return response.Fail(c, fiber.StatusBadRequest, 20002, "invalid id")
		}

		var row models.Serial
		if err := gdb.First(&row, "id = ?", id).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return response.Fail(c, fiber.StatusNotFound, 20003, "not found")
			}
			return response.Fail(c, fiber.StatusInternalServerError, 20001, "db error")
		}
		return response.OK(c, row)
	})
}
