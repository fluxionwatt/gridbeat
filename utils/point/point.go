package point

var A map[string][]Point

func init() {
	A = make(map[string][]Point)
	A["p1"] = []Point{
		{
			Address:   uint16(40001),
			Quantity:  2,
			PointType: HOLDING_REGISTER,
			Name:      "key",
			DataType:  DataTypeU16,
			Access:    "ro",
			Unit:      "unit",
			Gain:      1,
			Offset:    0,
			Desc:      "",
		},
	}
}

type Point struct {
	Address   uint16   `gorm:"not null;index" json:"address"`                      // 地址
	Quantity  uint16   `gorm:"not null;default:1" json:"quantity"`                 // 寄存器数量
	PointType RegType  `gorm:"not null" json:"point_type"`                         // holding/input/coil/discrete 	// 功能（寄存器类型）
	Name      string   `json:"name" yaml:"name"`                                   // 信号名，英文 key
	DataType  DataType `json:"dataType" yaml:"dataType"`                           // u16/s16/u32/float32...
	Access    string   `json:"access" yaml:"access"`                               // RO/RW/WO
	Unit      string   `json:"unit,omitempty" yaml:"unit,omitempty"`               // 单位，如 V/A/kW/%/kWh
	Gain      float64  `json:"gain,omitempty" yaml:"gain,omitempty"`               // 线性变换：实际值 = Raw * Gain + Offset
	Offset    float64  `json:"offset,omitempty" yaml:"offset,omitempty"`           //
	Desc      string   `json:"description,omitempty" yaml:"description,omitempty"` // 说明
}

// 寄存器类型
type RegType uint

const (
	HOLDING_REGISTER  RegType = 0
	INPUT_REGISTER    RegType = 1
	COILS_REGISTER    RegType = 2
	DISCRETE_REGISTER RegType = 3
)

// 设备类型
type DeviceType uint

const (
	DeviceTypeOther    DeviceType = 0
	DeviceTypeESS      DeviceType = 1
	DeviceTypePCS      DeviceType = 2
	DeviceTypePID      DeviceType = 3
	DeviceTypeInvertor DeviceType = 4
	DeviceTypeLogger   DeviceType = 5
	DeviceTypeSTS      DeviceType = 6
)

// 数据类型
type DataType uint

const (
	DataTypeByte DataType = 0
	DataTypeU16  DataType = 1
	DataTypeS16  DataType = 2
	DataTypeU32  DataType = 3
	DataTypeU64  DataType = 4
	DataTypeF32  DataType = 5
)

type DeviceAdapter struct {
	UUID       string     `gorm:"primaryKey;column:uuid;size:36;uniqueIndex;not null" json:"uuid"` //
	Vendor     string     // 厂商
	Model      string     // 型号
	DeviceType DeviceType // 类型
	Version    string     // 版本
}
