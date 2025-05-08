const setAuthCookies = (res, result, status = 200) => {
    res
        .cookie("jwt", result.accessToken, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        })
        .cookie("csrf-token", result.csrfToken, {
            httpOnly: false,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        })
        .status(status)
        .json({
            user: result.user,
            csrfToken: result.csrfToken,
        });
};

module.exports = setAuthCookies;
