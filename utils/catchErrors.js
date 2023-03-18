function catchError (error, displayError) {
  let errorMsg
  if (error.response) {
    // error range 2XX
    errorMsg = error.response.data
    console.log('Error response', errorMsg)
    // for upload image
    if (error.response.data.error) {
      errorMsg = error.response.data.error.message
    }
  } else if (error.request) {
    // has requset but no res
    errorMsg = error.request
    console.log('Error request', errorMsg)
  } else {
    // something else
    errorMsg = error.message
    console.log('Error message', errorMsg)
  }
  displayError(errorMsg)
}

export default catchError
