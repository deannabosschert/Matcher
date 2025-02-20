const editForm = document.getElementById('form')
const registerForm = document.getElementById('registerForm')

if (editForm) {
  const inputs = editForm.querySelectorAll('input')
  const selects = editForm.querySelectorAll('select')
  for (i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener('change', () => {
        updateProfile(editForm)
      })
  }
  for (i = 0; i < selects.length; i++) {
    selects[i].addEventListener('change', () => {
      updateProfile(editForm)
    })
  }
}

const login = (form) => {

  event.preventDefault()

  const url = `/login`

  let data = {
    username: form.elements.username.value,
    password: form.elements.password.value
  }

  sendData(url, data);
}

const registerUser = (form) => {

  event.preventDefault()

  const url = `/register`

  let latitude
  let longitude

  if (marker) {
    latitude = marker._latlng.lat;
    longitude = marker._latlng.lng;
  }

  let data = {
    username: form.elements.username.value,
    password: form.elements.password.value,
    email: form.elements.email.value,
    name: form.elements.name.value,
    gender: form.elements.gender.value,
    age: form.elements.age.value,
    looking: form.elements.looking.value,
    lat: latitude,
    lng: longitude
  }

  sendData(url, data);
}

const updateProfile = (form) => {
  const url = `/edit`

  let data = {
    name: form.elements.name.value,
    age: form.elements.age.value,
    gender: form.elements.gender.value,
    looking: form.elements.looking.value,
    lat: form.elements.lat.value,
    lng: form.elements.lng.value
  }

  sendData(url, data);
}

const updateValues = (marker) => {
  let lat = document.getElementById("lat");
  let lng = document.getElementById("lng");
  let form = document.getElementById("form");
  lat.setAttribute("value", marker._latlng.lat);
  lng.setAttribute("value", marker._latlng.lng);
  updateProfile(form);
}

const sendData = async (url, data) => {
  xhr = new XMLHttpRequest()
  const errorDisplay = document.querySelector('.error-display')

  // created bodyData to send though XML using this: https://stackoverflow.com/questions/35325370/how-do-i-post-a-x-www-form-urlencoded-request-using-fetch
  let bodyData = []

  for (property in data) {
    const encodedKey = encodeURIComponent(property)
    const encodedValue = encodeURIComponent(data[property])
    bodyData.push(encodedKey + "=" + encodedValue)
  }

  bodyData = bodyData.join("&")

  if (editForm) {
    editForm.parentNode.classList.remove('updated')
  } else if (registerForm) {
    registerForm.parentNode.classList.remove('error')
  }

  try {
    xhr.open('POST', url)
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')

    xhr.onload = function() {
      if (this.status == 200) {
        if (this.responseText === "logged in") {
          // handle what happens when passport authenticates
          window.location.replace("/")
        } else if (this.responseText === "updated profile") {
          editForm.parentNode.classList.add('updated')
        } else {
          if (registerForm) {
            registerForm.parentNode.classList.add('error')
          }
          errorDisplay.innerHTML = this.responseText
        }
      } else {
        errorDisplay.innerHTML = this.responseText
      }
    }

    xhr.send(bodyData)
  } catch (e) {
    console.log(e)
  }
}