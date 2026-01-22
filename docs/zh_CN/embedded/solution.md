## 版本与 Layer 选择

版本直接选 scarthgap（便于同时兼容 ST 的 STM32MP25/MP257 BSP 分支、以及主线 OE 层）。

需要的 layers
 *	poky（oe-core + bitbake）
 *	meta-openembedded（networking/oe/python 等常用包）
 *	meta-swupdate（把 SWUpdate 集成进 Yocto，并生成 .swu 更新包、以及 rescue/initrd 等）
 *	meta-st-stm32mp（STM32MP2/MP25/MP257 BSP）
 *	meta-gridbeat（你自己的业务 layer：gridbeat + 发行版默认配置）

其中 meta-swupdate 明确用于 “交叉编译 SWUpdate + 生成 compound SWU images”，并说明加入 bblayers 即可使用。 ST BSP layer meta-st-stm32mp 在 README 里说明依赖 poky/openembedded-core、meta-openembedded（meta-oe/meta-python），并且需要按机器接受 EULA（ACCEPT_EULA_$MACHINE = "1"）。ST 的 OpenSTLinux 发行包也以 scarthgap 作为 Yocto 基线之一（如 OpenSTLinux 6.6 + scarthgap 的组合）。

工程根目录（示例）：

```
embedded/
  layers/
    poky/
    meta-openembedded/
    meta-swupdate/
    meta-st-stm32mp/
    meta-gridbeat/
  build
```
