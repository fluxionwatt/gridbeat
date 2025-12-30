//go:build !dev
// +build !dev

package webui

import "embed"

//go:embed dist/*
var assets embed.FS

func Assets() embed.FS {
	return assets
}
