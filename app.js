//jshint esversion:6
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')
const passportlocalMongoose = require('passport-local-mongoose')
const findOrCreate = require('mongoose-findorcreate')
const { authenticate } = require('passport')

const app = express()

app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(
  express.urlencoded({
    extended: true,
  }),
)

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  }),
)

app.use(passport.initialize())
app.use(passport.session())
// mongoose.connect('mongodb://127.0.0.1:27017/ussCourseDB', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
mongoose.connect("mongodb+srv://admin-eric:adeline@cluster0.cdksd.mongodb.net/ussCourseDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.set('useFindAndModify', false)

const userSchema = new mongoose.Schema({
  fullname: String,
  username: String,
  password: String,
  email: String,
  osceStarted: Boolean,
  osceCompleted: Boolean,
  osceStartTime: String,
  osceAnswer: Array,
  osceScore: String,
  surveyScore: Array,
  surveyComment: String,
  surveyCompleted: Boolean,
  osceMark: Array,
})

userSchema.plugin(passportlocalMongoose)
userSchema.plugin(findOrCreate)

const User = new mongoose.model('User', userSchema)

passport.use(User.createStrategy())

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.get('/', function (req, res) {
  
  res.redirect('/userpage')
})

app.get('/osce', function (req, res) {
  const osce = require('./answerlist.json');
  if (req.isAuthenticated()) {
    if (!req.user.osceStarted) {
      let time = new Date().getTime()
      User.findOneAndUpdate(
        {
          username: req.user.username,
        },
        {
          $set: { osceStarted: true, osceStartTime: time },
        },
        function (error, success) {
          if (error) {
            console.log(error)
          } else {
            console.log(success)
          }
        },
      )
    }

    res.render('maintest', {
      userData: req.user,
      osce: JSON.stringify(osce),
      pages: req.query.pages
    })
  } else {
    res.render('login')
  }
})


app.get('/login', function (req, res) {
  res.render('login')
})

app.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/login')
})

app.get('/admin', function (req, res) {
  res.render('admin')
})

app.get('/1234secret', function (req, res) {
  res.render('register')
})

app.get('/userpage', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('userpage', {
      userData: req.user,
    })
  } else {
    res.redirect('login')
  }
})

app.post('/register', (req, res) => {
  User.findOne(
    {
      username: req.body.username,
    },
    (err, user) => {
      if (err) {
        console.log(err)
      }
      if (user) {
        return res.render('register', {
          message: 'User already exist, pick another username',
        })
      } else {
        User.register(
          {
            username: req.body.username,
            email: req.body.email,
            fullname: req.body.name,
            osceStarted: false,
            osceCompleted: false,
            osceStartTime: 'empty',
            osceAnswer: [
              {
                '1': '',
                '2': '',
                '3': '',
                '4': '',
                '5': '',
                '6': '',
                '7': '',
                '8': '',
                '9': '',
                '10': '',
                '11': '',
                '12': '',
                '13': '',
                '14': '',
                '15': '',
                '16': '',
                '17': '',
                '18': '',
                '19': '',
                '20': '',
                '21': '',
                '22': '',
                '23': '',
                '24': '',
                '25': '',
                '26': '',
                '27': '',
                '28': '',
                '29': '',
                '30': ''
              }
                
          
            ],
            osceScore: '',
            surveyScore: [],
            surveyComment: '',
            surveyCompleted: false,
            osceMark: [],
          },
          req.body.password,
          (err, user) => {
            if (err) {
              console.log(err)
              res.render('register')
            } else {
              passport.authenticate('local')(req, res, () => {
                res.redirect('/userpage')
              })
            }
          },
        )
      }
    },
  )
})

app.post('/login', (req, res, next) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  })
  console.log(user)
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      // *** Display message without using flash option
      // re-render the login form with a message
      return res.render('login', {
        messagelogin: info.message,
      })
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err)
      }
      return res.redirect('/userpage')
    })
  })(req, res, next)
})

app.post('/admin', (req, res) => {
  if (req.body.username == 'eric' && req.body.password == 'adeline') {
    res.render('register')
  } else {
    res.render('admin', {
      message: 'wrong credential details',
    })
  }
})


app.post('/update', (req, res) => {
  console.log(req.body);
  if (req.isAuthenticated()) {
    if (req.body["1"])
    {
      let answer = req.body["1"];
      updateAnswer(1, answer);
    }
    if (req.body["2"])
    {
      let answer = req.body["2"];
      updateAnswer(2, answer);
    }
    if (req.body["3"])
    {
      let answer = req.body["3"];
      updateAnswer(3, answer);
    }
    if (req.body["4"])
    {
      let answer = req.body["4"];
      updateAnswer(4, answer);
    }
    if (req.body["5"])
    {
      let answer = req.body["5"];
      updateAnswer(5, answer);
    }
    if (req.body["6"])
    {
      let answer = req.body["6"];
      updateAnswer(6, answer);
    }
    if (req.body["7"])
    {
      let answer = req.body["7"];
      updateAnswer(7, answer);
    }
    if (req.body["8"])
    {
      let answer = req.body["8"];
      updateAnswer(8, answer);
    }
    if (req.body["9"])
    {
      let answer = req.body["9"];
      updateAnswer(9, answer);
    }
    if (req.body["10"])
    {
      let answer = req.body["10"];
      updateAnswer(10, answer);
    }
    if (req.body["11"])
    {
      let answer = req.body["11"];
      updateAnswer(11, answer);
    }
    if (req.body["12"])
    {
      let answer = req.body["12"];
      updateAnswer(12, answer);
    }
    if (req.body["13"])
    {
      let answer = req.body["13"];
      updateAnswer(13, answer);
    }
    if (req.body["14"])
    {
      let answer = req.body["14"];
      updateAnswer(14, answer);
    }
    if (req.body["15"])
    {
      let answer = req.body["15"];
      updateAnswer(15, answer);
    }
    if (req.body["16"])
    {
      let answer = req.body["16"];
      updateAnswer(16, answer);
    }
    if (req.body["17"])
    {
      let answer = req.body["17"];
      updateAnswer(17, answer);
    }
    if (req.body["18"])
    {
      let answer = req.body["18"];
      updateAnswer(18, answer);
    }
    if (req.body["19"])
    {
      let answer = req.body["19"];
      updateAnswer(19, answer);
    }
    if (req.body["20"])
    {
      let answer = req.body["20"];
      updateAnswer(20, answer);
    }
    if (req.body["21"])
    {
      let answer = req.body["21"];
      updateAnswer(21, answer);
    }
    if (req.body["22"])
    {
      let answer = req.body["22"];
      updateAnswer(22, answer);
    }
    if (req.body["23"])
    {
      let answer = req.body["23"];
      updateAnswer(23, answer);
    }
    if (req.body["24"])
    {
      let answer = req.body["24"];
      updateAnswer(24, answer);
    }
    if (req.body["25"])
    {
      let answer = req.body["25"];
      updateAnswer(25, answer);
    }
    if (req.body["26"])
    {
      let answer = req.body["26"];
      updateAnswer(26, answer);
    }
    if (req.body["27"])
    {
      let answer = req.body["27"];
      updateAnswer(27, answer);
    }
    if (req.body["28"])
    {
      let answer = req.body["28"];
      updateAnswer(28, answer);
    }
    if (req.body["29"])
    {
      let answer = req.body["29"];
      updateAnswer(29, answer);
    }
    if (req.body["30"])
    {
      let answer = req.body["30"];
      updateAnswer(30, answer);
    }
    res.sendStatus(204);
  function updateAnswer(question, answer)
  {
    User.findOneAndUpdate(
      {
        username: req.body.username,
      },
      {
        $set: { ['osceAnswer.0.' + question]: answer },
      },
      function (error, success) {
        if (error) {
          console.log(error);
        } else {
          console.log(success);
        }
      }
    )
  }




  }
})

// app.post('/oscecomplete', (req, res) => {
//   if (req.isAuthenticated()) {
//     if (req.user.osceCompleted == false) {
//       User.findOneAndUpdate(
//         {
//           username: req.user.username,
//         },
//         {
//           $set: { osceCompleted: true },
//         },
//         function (error, success) {
//           if (error) {
//             console.log(error)
//           } else {
//             console.log(success)
//           }
//         },
//       )
//     } else {
//       res.sendStatus(204)
//     }
//   }
// })

app.get('/test', (req, res) => {
  if (req.isAuthenticated()) {
    // swapped user answer and correct answer, if you got time pls swap properly
    const user_answer = require('./mcqanswer.json')
    const answer = req.user.mcqAnswer[0]
    let marklist = []
    let total_score

    Array(answer).forEach(function (item) {
      let qnumber = Object.keys(item)
      let mark = 0

      for (let i = 0; i < qnumber.length; i++) {
        let number = Object.keys(item[qnumber[i]])
        for (let j = 0; j < number.length; j++) {
          if (
            item[qnumber[i]][number[j]] == user_answer[qnumber[i]][j] &&
            item[qnumber[i]][number[j]] != ''
          ) {
            mark = mark + 1
          } else if (
            item[qnumber[i]][number[j]] != user_answer[qnumber[i]][j] &&
            item[qnumber[i]][number[j]] != ''
          ) {
            mark = mark - 1
          }
        }
        if (mark < 0) {
          mark = 0
          marklist.push(mark)
        } else {
          marklist.push(mark)
          mark = 0
        }
      }
    })
    total_score = (marklist.reduce((a, b) => a + b, 0) / 250) * 100
  }
})

app.get('/oscesummary', (req, res) => {
  const osce = require('./answerlist.json');
  if (req.isAuthenticated()) {
    res.render('oscesummary', {
      userData: req.user,
      osceAnswer: JSON.stringify(req.user.osceAnswer[0]),
      osce: JSON.stringify(osce)
    })
  } else {
    res.redirect('login')
  }
})

app.post('/oscecomplete', (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.osceCompleted == false) {
      // swapped user answer and correct answer, if you got time pls swap properly
      const user_answer = require('./osceAnswer.json');
      const answer = req.user.osceAnswer[0];
      let marklist = [];
      let total_score = 0

      Array(answer).forEach(function (item) {
        let qnumber = Object.keys(item)
        let mark = 0

        for (let i = 0; i < qnumber.length; i++) {
          let number = Object.keys(item[qnumber[i]])
            if (
              item[qnumber[i]] == user_answer[qnumber[i]] &&
              item[qnumber[i]] != ''
            ) {
              mark += 1
            } else if (
              item[qnumber[i]] != user_answer[qnumber[i]] &&
              item[qnumber[i]] != ''
            ) {
              mark = 0
            }
          
          if (mark < 0) {
            mark = 0
            marklist.push(mark)
          } else {
            marklist.push(mark)
            mark = 0
          }
        }
      })
      total_score = (marklist.reduce((a, b) => a + b, 0) / 30) * 100
      User.findOneAndUpdate(
        {
          username: req.user.username,
        },
        {
          $set: { osceCompleted: true, osceScore: total_score },
        },
        function (error, success) {
          if (error) {
            console.log(error)
          } else {
            console.log(success)
          }
        },
      )
    } else {
      res.sendStatus(204)
    }
  }
})


// for marking
app.get('/oscemark', (req, res) => {
  User.findOne(
    {
      username: req.query.username,
    },
    (err, user) => {
      if (err) {
        console.log(err)
      } else {
        res.render('oscemark', {
          userData: user,
          osceAnswer: JSON.stringify(user.osceAnswer[0]),
        })
      }
    },
  )
})

app.post('/oscemark', (req, res) => {
  let answer = []
  const nonIntArray = Object.values(req.body[0])
  for (var i = 0; i < nonIntArray.length; i++) {
    answer.push(parseFloat(nonIntArray[i]))
  }

  score = (answer.reduce((a, b) => a + b, 0) / 92) * 100;

  User.findOneAndUpdate(
    {
      username: req.body.username,
    },
    {
      $set: { osceScore: score, osceMark: answer },
    },
    function (error, success) {
      if (error) {
        console.log(error)
      } else {
        res.redirect('/marking')
      }
    },
  )
})

app.get('/listing', function (req, res) {
  User.find({}, function (err, users) {
    const myJSON = JSON.stringify(users)
    res.render('listing', { users: myJSON })
  })
})

app.get('/marking', function (req, res) {
  User.find({}, function (err, users) {
    const myJSON = JSON.stringify(users)
    res.render('marking', { users: myJSON })
  })
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running at port 3000`)
})
