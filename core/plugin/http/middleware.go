package http

import (
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
	"github.com/sirupsen/logrus"
)

func AccessLogMiddleware(log *logrus.Logger) fiber.Handler {
	return func(c fiber.Ctx) error {
		start := time.Now()

		err := c.Next()

		latency := time.Since(start)

		log.WithFields(logrus.Fields{
			"ip":      c.IP(),
			"method":  c.Method(),
			"path":    c.Path(),
			"status":  c.Response().StatusCode(),
			"latency": latency.String(),
			"ua":      string(c.Request().Header.UserAgent()),
		}).Info("access")

		return err
	}
}

// 		Format:        `{"time":"${time}","requestid":"{requestid}""ip":"${ip}","method":"${method}","path":"${path}","status":${status},"latency":"${latency}","ua":"${ua}"}\n`,

// 和前端 UserInfo 对齐
type UserInfo struct {
	ID          string   `json:"id"`
	Username    string   `json:"username"`
	DisplayName string   `json:"displayName,omitempty"`
	Avatar      string   `json:"avatar,omitempty"`
	Roles       []string `json:"roles,omitempty"`
}

// JWT Claims
type Claims struct {
	UserID   string `json:"userId"`
	Username string `json:"username"`
	jwt.RegisteredClaims
}

var (
	// 实际项目中从配置或环境变量中读取
	jwtSecret       = []byte("change-me-to-a-strong-secret")
	defaultExpireIn = 60 * time.Minute // 默认 60 分钟
)

// 生成 JWT，支持自定义过期时间
func GenerateToken(userID, username string, expireIn time.Duration) (string, time.Time, error) {
	if expireIn <= 0 {
		expireIn = defaultExpireIn
	}
	now := time.Now()
	expireAt := now.Add(expireIn)

	claims := Claims{
		UserID:   userID,
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    "gateway-backend",
			Subject:   userID,
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(expireAt),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString(jwtSecret)
	return signed, expireAt, err
}

// 解析 & 校验 token
func ParseToken(tokenStr string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenStr, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})
	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}

	return nil, errors.New("invalid token")
}

// 从 Authorization: Bearer xxx 后者 参数里取出 token
func extractToken(c *gin.Context) (string, error) {
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		tokenStr := c.Query("token")
		if tokenStr == "" {
			return "", errors.New("missing Authorization header")
		}
		return tokenStr, nil
	}

	parts := strings.SplitN(authHeader, " ", 2)
	if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
		return "", errors.New("invalid Authorization header format")
	}
	return parts[1], nil
}

// Gin 中间件：保护接口用
func JWTMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenStr, err := extractToken(c)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"code":    401,
				"message": "Unauthorized",
			})
			return
		}

		claims, err := ParseToken(tokenStr)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"code":    401,
				"message": "Invalid or expired token",
			})
			return
		}

		// 把用户信息塞进 context，后面 handler 可以拿
		c.Set("userId", claims.UserID)
		c.Set("username", claims.Username)
		c.Next()
	}
}
