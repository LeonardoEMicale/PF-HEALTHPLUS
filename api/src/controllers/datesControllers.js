const { FieldValue } = require('firebase-admin/firestore');
const { db } = require('../firebase')
const sendEmail = require('./emailSenderControllers');

// --- Create a Date ---

const createDate = async ({ userId, doctorId, date, schedule, email }) => {
    try {
        const doctorData = await db.collection('doctors').doc(doctorId).get()
        const doctor = {
            ...doctorData.data()
        };
        if (!doctor.name) throw new Error(`No doctor matched with ID: ${doctorId}`);

        const userData = await db.collection('users').doc(userId).get()

        const user = {
            ...userData.data()
        };
        if (!user.name) throw new Error(`No user matched with ID: ${userId}`)

        const newDate = {
            user: user.name,
            doctor: doctor.name,
            specialty: doctor.specialty,
            date,
            schedule,
            status: 'pending'
        };

        const collectionRef = await db.collection('dates').add(newDate);

        newDate.id = collectionRef.id

        await db.collection('users').doc(userId).update({
            dates: FieldValue.arrayUnion(newDate)
        })

        //envia mail con la cita
        await sendEmail(email, doctor, date, schedule, user);


        return {
            status: 'created',
            newDate
        }
    } catch (error) {
        console.log(error);
        throw new Error(error)
    }
};

// --- check availability ---
// Con esta forma se hace una consultapara verificar que la cita que sequiere crear sea 

const checkDates = async () => {
    try {
        const dates = await db.collection('dates').get()
        const datesTaken = [];
        dates.forEach((date) => {
            datesTaken.push({
                ...date.data()
            })
        });
        return datesTaken;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
};

// --- Cancel a Date ---

const cancelDate = async (dateId, userId) => {
    try {
        const dateRef = await db.collection('dates').doc(dateId).get();
        const date = {
            id: dateRef.id,
            ...dateRef.data()
        };
        const userRef = await db.collection('users').doc(userId).get()
        const user = {
            ...userRef.data()
        }
        if(!user.email) throw new Error(`User with ID: ${userId} not found`)

        const filteredDates = user.dates.filter((date) => date.id !== dateId);

        if(date.status === 'canceled') throw new Error(`date with ID: ${dateId} already canceled`)
        if(date.status === 'taken') throw new Error(`date with ID: ${dateId} has been already taken`)

        else date.status = 'canceled'

        filteredDates.push(date)

        await db.collection('users').doc(userId).update({
            dates: filteredDates
        })
        if(date.doctor) {
            await db.collection('dates').doc(dateId).update({
                status: 'canceled'
            });
            return date
        } else throw new Error(`date with id ${dateId} not found`)
    } catch (error) {
        throw new Error(error)
    }
};

// --- Finish a date ---

const successDate = async (dateId, userId) => {
    try {
        const dateRef = await db.collection('dates').doc(dateId).get();
        const date = {
            id: dateRef.id,
            ...dateRef.data()
        };
        const userRef = await db.collection('users').doc(userId).get()
        const user = {
            ...userRef.data()
        }
        if(!user.email) throw new Error(`User with ID: ${userId} not found`)

        const filteredDates = user.dates.filter((date) => date.id !== dateId);

        if(date.status === 'taken') throw new Error(`date with ID: ${dateId} already taken`);
        if(date.status === 'canceled') throw new Error(`date with ID: ${dateId} has been canceled`)
        else date.status = 'taken'

        filteredDates.push(date)

        await db.collection('users').doc(userId).update({
            dates: filteredDates
        })
        if(date.doctor) {
            await db.collection('dates').doc(dateId).update({
                status: 'taken'
            });
            return date
        } else throw new Error(`date with id ${dateId} not found`)
    } catch (error) {
        throw new Error(error)
    }
};

module.exports = { createDate, checkDates, cancelDate, successDate };