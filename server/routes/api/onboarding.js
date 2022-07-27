const router = require("express").Router();
const { User } = require("../../db/models");

const STEPS = [
  [
    {
      name: "firstName",
      label: "First Name",
      type: "text",
      required: true,
    },
    {
      name: "lastName",
      label: "Last Name",
      type: "text",
    },
    {
      name: "bio",
      label: "Bio",
      type: "multiline-text",
    },
  ],
  [
    {
      name: "country",
      label: "Country",
      type: "text",
      required: true,
    },
    {
      name: "receiveNotifications",
      label:
        "I would like to receive email notifications for new messages when I'm logged out",
      type: "yes-no",
      required: true,
    },
    {
      name: "receiveUpdates",
      label: "I would like to receive updates about the product via email",
      type: "yes-no",
      required: true,
    },
  ],
];

const methodNotAllowed = (req, res, next) => {
  return res.header("Allow", ["GET", "POST"]).sendStatus(405);
};

const getOnboarding = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    return res.status(200).json({ steps: STEPS });
  } catch (error) {
    next(error);
  }
};

const updateOnboarding = async (req, res, next) => {
     const { id } = req.user;
     const { steps } = req.body;

     
     try {
          if (!req.user) {
               return res.sendStatus(401);
          }
          
          steps.forEach(step => step.forEach(obj => {
               const stepKeys = Object.keys(obj);
               const filterWrongKeys = stepKeys.filter(key => key !== "name" && key !== "value");
               
               if(obj.hasOwnProperty("name") && obj.hasOwnProperty("value")){
                    if (filterWrongKeys.length !== 0){
                         return res.sendStatus(400).json({ error: "bla"});
                    }
               } else {
                    return res.sendStatus(400).json({ error: "bla bla"});
               }
          }))

          let user = await User.findOne({ where: { id: id }, attributes: {exclude: ['password', 'salt', 'token']}});

          if(user.completedOnboarding === false){
               steps.map(step => step.map(i => {
                    user[i.name] = i.value
               }));
               user["completedOnboarding"] = true;
               await user.save();
               res.status(200).json(user);
          } else {
               return res.status(400).json({ error: "Onboarding form can be completed only once" })
          }
     } catch (error) {
          next(error);
     }
};

router.route("/").delete(async (req, res) => {
     User.destroy({
          where: {},
          truncate: true
     })

     res.status(201).json({ m: "good" })
})

router.route("/").post(updateOnboarding);
router.route("/").get(getOnboarding).all(methodNotAllowed);

module.exports = router;
