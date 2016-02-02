module.exports = {
  type: 'object',
  fields: {
    type: {type: 'string', required: true},
    publish: {type: 'boolean'},
    quote: {type: 'string', required: true},
    author: {type: 'string', required: true},
    link: [
      {type: 'string'}
      // TODO: implement protocol validation
    ],
    domain: [
      {type: 'string'}
      // TODO: implement tld validation
    ],
    created: {type: 'integer', required: true},
    random: {type: 'float', required: true},
    tags: {type: 'array'}
  }
}
