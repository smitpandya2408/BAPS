const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        // Check if user exists, if not create, if yes update
        let user = await User.findOne({ email: 'harish.tank@baps.org' });
        if (!user) {
            user = new User({
                email: 'harish.tank@baps.org',
                password: 'Harish@baps'
            });
            await user.save();
            console.log('User created: harish.tank@baps.org / Harish@baps');
        } else {
            user.password = 'Harish@baps';
            await user.save();
            console.log('User password updated: harish.tank@baps.org');
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
