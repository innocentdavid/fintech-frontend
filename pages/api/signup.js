
import {hash} from 'bcrypt'
import  NextApiRequest  from 'next'
import NextApiResponse from 'next' 

export default async function signup(){
    
    const{username,password} = req.body

    if (username || !password){
        return res.status(400).json({message:'Missing required feild'})

    }
    const hashedPassword = await hash(password,10)

    try{
        const newUser = await createUser({username, password:hashedPassword})
        return res.status(200).json({message: 'User created Sucessfully'})

    }catch (error){
        console.error('Error creating User', error )
        return res.status(500).json({message: 'Error creating user'})
    }
}