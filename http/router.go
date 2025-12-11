package http

var RouterGroupApp = new(RouterGroup)

type RouterGroup struct {
	Auth   AuthRouter
	System SystemRouter
}
