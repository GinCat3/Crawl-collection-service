export function formatTime(originalDateString: string) {

    // 将原始日期字符串解析为 Date 对象
    var originalDate = new Date(originalDateString);

    // 目标日期格式
    var targetDateFormat = "yyyy-MM-dd HH:mm:ss.SSSSSS";

    // 从 Date 对象获取各个日期组件
    var year = originalDate.getUTCFullYear();
    var month = originalDate.getUTCMonth() + 1; // 月份是从 0 开始的，所以需要加 1
    var day = originalDate.getUTCDate();
    var hours = originalDate.getUTCHours();
    var minutes = originalDate.getUTCMinutes();
    var seconds = originalDate.getUTCSeconds();
    var milliseconds = originalDate.getUTCMilliseconds();

    // 替换目标日期格式中的相应部分
    var formattedDate = targetDateFormat
    .replace("yyyy", year.toString())
    .replace("MM", (month < 10 ? "0" : "") + month)
    .replace("dd", (day < 10 ? "0" : "") + day)
    .replace("HH", (hours < 10 ? "0" : "") + hours)
    .replace("mm", (minutes < 10 ? "0" : "") + minutes)
    .replace("ss", (seconds < 10 ? "0" : "") + seconds)
    .replace("SSSSSS", (milliseconds < 10 ? "00" : milliseconds < 100 ? "0" : "") + milliseconds);

    return formattedDate
}