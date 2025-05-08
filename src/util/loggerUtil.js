const { createLogger, format, transports } = require("winston");

const loggerUtil = createLogger({
    level: "info",
    format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level.toUpperCase()} ${message}`;
        })
    ),
    transports: [new transports.Console()],
});

module.exports = loggerUtil;
