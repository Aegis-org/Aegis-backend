const updateLogic = () => {
    if (!userdetails) {
        res.status(401).json({ message: "You Have to Login First", edited: false })
    }
    else {
        User.findOneAndUpdate(
            { username: userdetails?.username },
            { nin: req.body.number, nextofkinNin: req.body.noknin, bvn: req.body.bvn },
            async (err, updated) => {
                if (err) {
                    res.status(401),
                        json({ login: false, message: 'Login to Make this request' });
                } else if (updated) {
                    const verified = await User.findOneAndUpdate({ username: userdetails?.username }, { verified: true },)
                    if (verified) {
                        res.status(201).json({ edited: true, message: 'Details Updated' });
                    }
                    else {
                        res.status(501).json({ edited: false, message: 'Error Occured' })
                    }

                } else {
                    res.status(401).json({
                        edited: false,
                        message: 'Error Occured Somewhere',
                    });
                }
            }
        );
    }
}

module.exports = updateLogic