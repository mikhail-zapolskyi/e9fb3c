const router = require("express").Router();

router.use("/messages", require("./messages"));
router.use("/conversations", require("./conversations"));
router.use("/users", require("./users"));
router.use("/onboarding", require("./onboarding"));

module.exports = router;
