### Local Development

```
brew install yarn
yarn install
yarn docs:dev
```

### Build

```
yarn docs:build
```

### Deployment

```
yarn docs:deploy
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

