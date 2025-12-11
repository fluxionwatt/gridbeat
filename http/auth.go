package http

import (
	"github.com/gofiber/fiber/v3"
)

type AuthRouter struct{}

func (s *AuthRouter) InitRouter(app *fiber.App) {
	app.Post("/v1/api/auth", Auth)
}

func Auth(c fiber.Ctx) error {
	type Request struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	req := new(Request)
	if err := c.Bind().Body(&req); err != nil {

		return fiber.ErrBadRequest
	}

	/*
		logger := GetLogger(c)

		db := GetDB(c)

		var user model.User
		if err := db.First(&user, "usename", req.Username, "password", req.Password).Error; err != nil {
			if err == gorm.ErrRecordNotFound {

				sessionTimeoutMinutes := 60
				token, _, err := GenerateToken("84a35e05-531f-4d96-8d5b-bc8a7a358493", req.Username, time.Duration(sessionTimeoutMinutes)*time.Minute)
				if err != nil {
					return fiber.ErrServiceUnavailable
				}

				data := fiber.Map{
					"token": token,
					"user": fiber.Map{
						"id":       "84a35e05-531f-4d96-8d5b-bc8a7a358493",
						"username": user.UserName,
					},
				}
				return c.JSON(data)
			} else {
				c.JSON(fiber.Map{"error": "database error"})
				return fiber.ErrInternalServerError
			}
		}
	*/

	//c.JSON(http.StatusForbidden, data)

	data := fiber.Map{
		"token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b",
		"user": fiber.Map{
			"id":       "84a35e05-531f-4d96-8d5b-bc8a7a358493",
			"username": "root",
		},
	}
	return c.JSON(data)
}
