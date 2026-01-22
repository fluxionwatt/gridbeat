### Local Development

```
npm install
npm run docs:dev
```

### Build

```
npm run docs:build
```

### Deployment

```
npm run docs:deploy

NODE_DEBUG=gh-pages npx gh-pages -d .vitepress/dist -b gh-pages
```

### 发布

```bash
git tag -d $(git tag -l)
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
gh release create v1.0.0 --title "v1.0.0" --notes "This is the release notes for version 1.0.0"
```

### 创建虚拟串口

```
socat -d -d pty,raw,echo=0,link=/tmp/ttys001 pty,raw,echo=0,link=/tmp/ttys002
```

