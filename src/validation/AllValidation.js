exports.validName  =(name)=>{
    const regex = /^[a-zA-Z ]+$/;
    return regex.test(name);
}

exports.validEmail = (email)=>{
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}

exports.validPassword = (password)=>{
    const regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return regex.test(password);
}