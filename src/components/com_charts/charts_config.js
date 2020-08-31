
// 计算rem
let getRem = function (res) {
    let clientWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
    if (!clientWidth) return;
    let fontSize = clientWidth / 1920;
    return res * fontSize;
}

// 鼠标移入
let tooltip = [
    {
        extraCssText: 'box-shadow: 0 0 5px rgba(0, 0, 0, 0.3)',
        trigger: "item",
        backgroundColor: "rgba(255, 255, 255, .8)",
        textStyle: {
            fontSize: getRem(16),
            color: '#333'
        },
        confine: true,
        show: true,
        padding: [10, 10],
    },
    {
        extraCssText: 'box-shadow: 0 0 5px rgba(0, 0, 0, 0.3)',
        confine: true,
        trigger: "axis",
        axisPointer: {
            label: {
                show: false,
            },
            lineStyle: {
                width: 0
            }
        },
        backgroundColor: "rgba(255, 255, 255, .8)",
        textStyle: {
            fontSize: getRem(16),
            color: "#333"
        },
        padding: [10, 10],
    }
];

// 坐标轴缩放
let dataZoom = [
    {
        type: "inside",
        show: true,
        xAxisIndex: [0],
        start: 1,
        end: 30
    }
];

let fontColor = "#666";
let lineColor = '#999999';

let lineStyle = {
    // 坐标轴名称
    nameTextStyle: {
        color: fontColor,
        fontSize: getRem(16)
    },
    // 坐标标签字体
    axisLabel: {
        color: fontColor,
        fontSize: getRem(16)
    },
    // 坐标线
    axisLine: {
        show: true,
        lineStyle: {
            color: lineColor,
        }
    },
    // 坐标刻度
    axisTick: {
        show: false
    },

    splitLine: {
        show: false,
        lineStyle: {
            color: lineColor
        }
    },
};


export default {
    tooltip,
    dataZoom,
    lineStyle,
    getRem
}