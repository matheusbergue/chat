const form =  document.getElementById('l-form-login')
const loginButton = document.getElementById('submit')
const newContaButton = document.getElementById('new-conta-button')
const formLogin = document.getElementById('l-form-login')
const formNewLogin = document.getElementById('l-form-new-login')
const submitNewConta = document.getElementById('submitCreateConta')


loginButton.addEventListener('click', async event => {
    const t = new FormData(form)
    const d = Object.fromEntries(t)


    console.log(d)

    event.preventDefault()
    const data = {
        body: JSON.stringify(d),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const response = await fetch('http://192.168.0.102:3000/login', data)
    const body = await response.json()


    console.log(body)
    



    if (body) {
        localStorage.setItem('loginData', JSON.stringify(body))
        sessionStorage.setItem('l', true)
        window.location.replace('/')
    } else window.alert('Usuario ou senha incorreto!!!')
})



newContaButton.addEventListener('click', event => {

    formLogin.style.opacity = '0'
    setTimeout(e => {
        formLogin.style.display = 'none'
        formNewLogin.style.display = 'flex'
        setTimeout(e => {
            formNewLogin.style.opacity = '1'
        })
    }, 200)
})


formNewLogin.addEventListener('submit', event => {
    event.preventDefault()
    console.log('adsawdasawda')
})