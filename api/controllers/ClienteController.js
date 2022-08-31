const database = require('../models');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class Cliente {
    static async createCliente (req, res) {
        try {
            const { name, username, password } = req.body;
            const userExist = await Cliente.checkUsername(username);
            if(userExist) {
                res.status(422).send({message: 'Username already registered'});
            } else {
                const hash = await Cliente.gerarSenhaHash(password);
                await database.Clientes.create({name, username, password: hash})
                res.status(201).send({});
            }

    }  catch (err) {
            throw err;
    }}

    static async loginCliente (req, res) {
        try {
            const { username, password } = req.body;
            const userExist = await Cliente.checkUsername(username);
            if(userExist) {
                const matchPass = await Cliente.conferirSenha(password, userExist[1]);

                if(matchPass) {
                    const secret = process.env.SECRET;
                    const token = jwt.sign({
                        id: userExist[1]
                    }, secret)
                    res.status(201).json({message: 'Autenticação com sucesso', token})
                } else {
                    res.status(401).send({message: 'Username or Password Incorrect'})
                }
            } else {
                res.status(401).send({message: 'Username or Password Incorrect'})
            }

    }  catch (err) {
            throw err;
    }}

    static async checkUsername(username) {
        const user = await database.Clientes.findOne({ where: {
            username: username
        }});

        if(user == null) {
            return false;
        } else {
            return [true, user.id];
        }
    }
    	
    static async gerarSenhaHash(password) {
        const saltRounds = 15;
        const hash = await bcrypt.hash(password, saltRounds);  
        return hash; 
    }

    static async conferirSenha(password, id) {
        const cliente = await database.Clientes.findOne({ where: { id: id }});
        if(!password || !cliente.password) {
            return false;
        }
        const match = await bcrypt.compare(password, cliente.password);
        return match;
    }

    static checkToken (req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if(!token) {
            res.status(401).json({msg: 'acesso negado'})
        }

        try {
            const secret = process.env.SECRET;
            jwt.verify(token, secret)
            next();
        } catch (err) {
            res.status(400).json({msg: 'token invalido'});
        }
    }
}

module.exports = Cliente;