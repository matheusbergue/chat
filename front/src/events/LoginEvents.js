const form =  document.getElementById('l-form-login')


form.addEventListener('submit', async event => {
    const t = new FormData(form)
    const d = Object.fromEntries(t)
    event.preventDefault()
    const data = {
        body: JSON.stringify(d),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const response = await fetch('http://localhost:3000/login', data)
    const body = await response.json()


    console.log(body)
    



    if (body) {
        localStorage.setItem('loginData', JSON.stringify(body))
        sessionStorage.setItem('l', true)
        window.location.replace('/')
    } else window.alert('Usuario ou senha incorreto!!!')
})