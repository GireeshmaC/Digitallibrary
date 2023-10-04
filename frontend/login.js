function register() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log(email, name)

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify({
        email,
        password,
        mobile: '13648328',
        role: 'USER'
    });
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    fetch("http://localhost:3000/api/v1/user/login", requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log(result)
        // window.location.pathname = "/public/logreg.html";
      })
      .catch(error => console.log('error', error));
    
}