var constraints;
function checkConstraints() {
  constraints(5);
}

var a = new Promise((resolve, reject) => {
  console.log('create p');

  constraints = (val) => {
    console.log('set constraint', val);
    if (val > 3) {
      resolve(val);
    }
    reject();
  };
});

console.log('a?', a);

a.then((params) => {
  console.log('a done', params)
})

checkConstraints();
