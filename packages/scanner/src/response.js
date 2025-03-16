export const response = (res, data, message = "Ok") => {
  return res.status(200).json({
    data,
    message,
    isError: false,
  })

}

export const responseError = (res, code, data, message) => {
  return res.status(code).json({
    data,
    message,
    isError: true
  })
}