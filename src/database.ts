import mongoose from 'mongoose'

mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)

mongoose
  .connect(process.env.DB_CONNECTION!)
  .then(() => console.log('DB is up'))
  .catch(err => console.log(err))
