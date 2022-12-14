const NotFoundLinks = require('../src')
const { Writable } = require('stream')
const path = require('path')


beforeAll(() => mockRemoteServer.listen())
afterEach(() => mockRemoteServer.resetHandlers())
afterAll(() => mockRemoteServer.close())

test('throw an error if the options folder doesn\'t contains a valid folder', () => {
    expect(() => {
        const options = {
            folder: '/fooooooo'
        }
        new NotFoundLinks(options)
    }).toThrow('The folder "/fooooooo" doesn\'t exist, please share an existing folder.')
})

test('Get the sucessful result of the remote calls', (done) => {
    const options = {
      folder: path.resolve(__dirname, 'fixtures/remote-success-case-1-link')
    }
    const stream = new NotFoundLinks(options)
    stream
      .on('data', (chunk) => {
        expect(JSON.parse(chunk.toString())).toEqual({
            url: 'https://github.com/',
            status: 200,
            passed: true
        })
      })
      .on('end', done)
      .on('error', done)
})

test('Get 2 sucessful result of the remote calls (status code 200/201)', (done) => {
    const options = {
      folder: path.resolve(__dirname, 'fixtures/remote-success-case-2-links'),
    }
    const stream = new NotFoundLinks(options)
    .on('data', () => {})
    .on('end', () => {
      try {
          const { result, errors } = stream
          expect(result.length).toEqual(2)
          expect(result[0]).toEqual({
              url: 'https://github.com/',
              status: 200,
              passed: true
          })
          expect(result[1]).toEqual({
              url: 'https://gitlab.com/',
              status: 201,
              passed: true
          })
          expect(errors.length).toEqual(0)
          done()
      } catch (err) {
          done(err)
      }
    })
    .on('error', done)
})

test('Get 2 sucessful result of the remote calls (status code 200/201)', (done) => {
    const options = {
      folder: path.resolve(__dirname, 'fixtures/remote-success-case-2-links'),
    }
    const stream = new NotFoundLinks(options)
    .on('data', () => {})
    .on('end', () => {
      try {
          const { result, errors } = stream
          expect(result.length).toEqual(2)
          expect(result[0]).toEqual({
              url: 'https://github.com/',
              status: 200,
              passed: true
          })
          expect(result[1]).toEqual({
              url: 'https://gitlab.com/',
              status: 201,
              passed: true
          })
          expect(errors.length).toEqual(0)
          done()
      } catch (err) {
          done(err)
      }
    })
    .on('error', done)
})

test('Get 2 sucessful result and 1 broken of the remote calls (status code 200/201/404)', () => {
  return new Promise((resolve, reject) => {
    const options = {
      folder: path.resolve(__dirname, 'fixtures/remote-invalid-case-3-links'),
    }
    const stream = new NotFoundLinks(options)
    .on('data', () => {})
    .on('end', () => {
      try {
          const { result, errors } = stream
          expect(result.length).toEqual(3)
          expect(result[0]).toEqual({
              url: 'https://github.com/',
              status: 200,
              passed: true
          })
          expect(result[1]).toEqual({
              url: 'https://gitlab.com/',
              status: 201,
              passed: true
          })
          expect(result[2]).toEqual({
              url: 'https://broken.com/test',
              status: 404,
              passed: false
          })
          expect(errors.length).toEqual(1)
          expect(errors[0]).toEqual({
              url: 'https://broken.com/test',
              status: 404,
              passed: false
          })
          resolve()
      } catch (err) {
          reject(err)
      }
    })
    .on('error', reject)
  })
})

test('Get only 4 broken of the remote calls (status code 404/ 500/ 403 /401)', () => {
  return new Promise((resolve, reject) => {
    const options = {
      folder: path.resolve(__dirname, 'fixtures/remote-invalid-case-4-links'),
    }
    const stream = new NotFoundLinks(options)
    .on('data', () => {})
    .on('end', () => {
      try {
          const { result, errors } = stream
          expect(result.length).toEqual(4)
          expect(result[0]).toEqual({
              url: 'https://ggithub.com/',
              status: 401,
              passed: false
          })
          expect(result[1]).toEqual({
              url: 'https://gittlab.com/',
              status: 500,
              passed: false
          })
          expect(result[2]).toEqual({
              url: 'https://broken.com/test',
              status: 404,
              passed: false
          })
          expect(result[3]).toEqual({
              url: 'https://broken.com/',
              status: 403,
              passed: false
          })
          expect(errors.length).toEqual(4)
          expect(errors).toEqual(result)
          resolve()
      } catch (err) {
          reject(err)
      }
    })
    .on('error', reject)
  })
})

test('Duplicate - Get 2 sucessful result and 1 broken of the remote calls', () => {
  return new Promise((resolve, reject) => {
    const options = {
      folder: path.resolve(__dirname, 'fixtures/remote-duplicate-links'),
    }
    const stream = new NotFoundLinks(options)
    .on('data', () => {})
    .on('end', () => {
      try {
          const { result, errors } = stream
          expect(result.length).toEqual(3)
          expect(result[0]).toEqual({
              url: 'https://github.com/',
              status: 200,
              passed: true
          })
          expect(result[1]).toEqual({
              url: 'https://gitlab.com/',
              status: 201,
              passed: true
          })
          expect(result[2]).toEqual({
              url: 'https://broken.com/test',
              status: 404,
              passed: false
          })
          expect(errors.length).toEqual(1)
          expect(errors[0]).toEqual({
              url: 'https://broken.com/test',
              status: 404,
              passed: false
          })
          resolve()
      } catch (err) {
          reject(err)
      }
    })
    .on('error', reject)
  })
})

test('Duplicate and multiple files - Get 3 sucessful result and 3 broken of the remote calls', () => {
  return new Promise((resolve, reject) => {
    const options = {
      folder: path.resolve(__dirname, 'fixtures/remote-multiple-files')
    }
    const stream = new NotFoundLinks(options)
    .on('data', () => {})
    .on('end', () => {
      try {
          const { result, errors } = stream
          expect(result.length).toEqual(6)
          expect(result[0]).toEqual({
              url: 'https://broken.com/test',
              status: 404,
              passed: false
          })
          expect(result[1]).toEqual({
              url: 'https://broken.com/',
              status: 403,
              passed: false
          })
          expect(result[2]).toEqual({
              url: 'https://ggithub.com/',
              status: 401,
              passed: false
          })
          expect(result[3]).toEqual({
              url: 'https://bitbucket.com/',
              status: 204,
              passed: true
          })
          expect(result[4]).toEqual({
              url: 'https://github.com/',
              status: 200,
              passed: true
          })
          expect(result[5]).toEqual({
              url: 'https://gitlab.com/',
              status: 201,
              passed: true
          })
          expect(errors.length).toEqual(3)
          expect(errors[0]).toEqual({
              url: 'https://broken.com/test',
              status: 404,
              passed: false
          })
          expect(errors[1]).toEqual({
              url: 'https://broken.com/',
              status: 403,
              passed: false
          })
          expect(errors[2]).toEqual({
              url: 'https://ggithub.com/',
              status: 401,
              passed: false
          })
          resolve()
      } catch (err) {
          reject(err)
      }
    })
    .on('error', reject)
  })
})


test('Ignore urls', () => {
  return new Promise((resolve, reject) => {
    const options = {
      folder: path.resolve(__dirname, 'fixtures/remote-multiple-files'),
      ignore: {
        urls: [
          'https://gitlab.com',
          'https://github.com'
        ]
      }
    }
    const stream = new NotFoundLinks(options)
    .on('data', () => {})
    .on('end', () => {
      try {
          const { result, errors } = stream
          expect(result.length).toEqual(6)
          expect(result[0]).toEqual({
              url: 'https://broken.com/test',
              status: 404,
              passed: false
          })
          expect(result[1]).toEqual({
              url: 'https://broken.com/',
              status: 403,
              passed: false
          })
          expect(result[2]).toEqual({
              url: 'https://ggithub.com/',
              status: 401,
              passed: false
          })
          expect(result[3]).toEqual({
              url: 'https://bitbucket.com/',
              status: 204,
              passed: true
          })
          expect(result[4]).toEqual({
              url: 'https://github.com',
              status: 'ignored',
              passed: true
          })
          expect(result[5]).toEqual({
              url: 'https://gitlab.com',
              status: 'ignored',
              passed: true
          })
          expect(errors.length).toEqual(3)
          expect(errors[0]).toEqual({
              url: 'https://broken.com/test',
              status: 404,
              passed: false
          })
          expect(errors[1]).toEqual({
              url: 'https://broken.com/',
              status: 403,
              passed: false
          })
          expect(errors[2]).toEqual({
              url: 'https://ggithub.com/',
              status: 401,
              passed: false
          })
          resolve()
      } catch (err) {
          reject(err)
      }
    })
    .on('error', reject)
  })
})

test('Ignore urls (using wildcards)', () => {
  return new Promise((resolve, reject) => {
    const options = {
      folder: path.resolve(__dirname, 'fixtures/remote-multiple-files'),
      ignore: {
        urls: [
          'https://broken.com/*'
        ]
      }
    }
    const stream = new NotFoundLinks(options)
    .on('data', () => {})
    .on('end', () => {
      try {
          const { result, errors } = stream
          expect(result.length).toEqual(6)
          expect(result[0]).toEqual({
              url: 'https://broken.com/test',
              status: 'ignored',
              passed: true
          })
          expect(result[1]).toEqual({
              url: 'https://broken.com',
              status: 'ignored',
              passed: true
          })
          expect(result[2]).toEqual({
              url: 'https://ggithub.com/',
              status: 401,
              passed: false
          })
          expect(result[3]).toEqual({
              url: 'https://bitbucket.com/',
              status: 204,
              passed: true
          })
          expect(result[4]).toEqual({
              url: 'https://github.com/',
              status: 200,
              passed: true
          })
          expect(result[5]).toEqual({
              url: 'https://gitlab.com/',
              status: 201,
              passed: true
          })
          expect(errors.length).toEqual(1)
          expect(errors[0]).toEqual({
              url: 'https://ggithub.com/',
              status: 401,
              passed: false
          })
          resolve()
      } catch (err) {
          reject(err)
      }
    })
    .on('error', reject)
  })
})

test('Ignore files', () => {
  return new Promise((resolve, reject) => {
    const options = {
      folder: path.resolve(__dirname, 'fixtures/remote-multiple-files'),
      ignore: {
        files: [
          './file-success.md'
        ]
      }
    }
    const stream = new NotFoundLinks(options)
    .on('data', () => {})
    .on('end', () => {
      try {
          const { result, errors } = stream
          expect(result.length).toEqual(4)
          expect(result[0]).toEqual({
              url: 'https://broken.com/test',
              status: 404,
              passed: false
          })
          expect(result[1]).toEqual({
              url: 'https://broken.com/',
              status: 403,
              passed: false
          })
          expect(result[2]).toEqual({
              url: 'https://ggithub.com/',
              status: 401,
              passed: false
          })
          expect(result[3]).toEqual({
              url: 'https://bitbucket.com/',
              status: 204,
              passed: true
          })
          expect(errors.length).toEqual(3)
          expect(errors[0]).toEqual({
              url: 'https://broken.com/test',
              status: 404,
              passed: false
          })
          expect(errors[1]).toEqual({
              url: 'https://broken.com/',
              status: 403,
              passed: false
          })
          expect(errors[2]).toEqual({
              url: 'https://ggithub.com/',
              status: 401,
              passed: false
          })
          resolve()
      } catch (err) {
          reject(err)
      }
    })
    .on('error', reject)
  })
})

test('Ignore files', () => {
  return new Promise((resolve, reject) => {
    const options = {
      folder: path.resolve(__dirname, 'fixtures/remote-multiple-files'),
      ignore: {
        files: [
          './file-success.md'
        ]
      }
    }
    const stream = new NotFoundLinks(options)
    .on('data', () => {})
    .on('end', () => {
      try {
          const { result, errors } = stream
          expect(result.length).toEqual(4)
          expect(result[0]).toEqual({
              url: 'https://broken.com/test',
              status: 404,
              passed: false
          })
          expect(result[1]).toEqual({
              url: 'https://broken.com/',
              status: 403,
              passed: false
          })
          expect(result[2]).toEqual({
              url: 'https://ggithub.com/',
              status: 401,
              passed: false
          })
          expect(result[3]).toEqual({
              url: 'https://bitbucket.com/',
              status: 204,
              passed: true
          })
          expect(errors.length).toEqual(3)
          expect(errors[0]).toEqual({
              url: 'https://broken.com/test',
              status: 404,
              passed: false
          })
          expect(errors[1]).toEqual({
              url: 'https://broken.com/',
              status: 403,
              passed: false
          })
          expect(errors[2]).toEqual({
              url: 'https://ggithub.com/',
              status: 401,
              passed: false
          })
          resolve()
      } catch (err) {
          reject(err)
      }
    })
    .on('error', reject)
  })
})
