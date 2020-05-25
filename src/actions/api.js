const user = [
    { name: "test", id: "1234" },
    { name: "test2", id: "1234" },
    { name: "test3", id: "1234" },

]

export default test = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            return resolve(user);
        }, 2000)
    })
}