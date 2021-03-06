describe('Component 1', function () {
  describe('doStuff()', function () {
    it('does stuff', function () {
      console.log('do stuff!');
      console.log('(this should make it to the test report.)');
    });

    it('pending test');

    describe('nested description 1', function () {
      beforeEach(function () {
        console.log('Output in hooks should also make it to the report.');
      });
      
      it('should also do stuff in this case', function (done) {
        setTimeout(function () {
          console.log('Yay!');
          done();
        }, 500)
      });

      it('but this fails', function () {
        throw new Error('No!');
      });
    });
  });

  describe('doOtherStuff()', function () {
    describe('when stuff is stuffed', function () {
      it('should be alright', function () {});
      it('but some things might fail here as well', function () {
        console.log('Ok, trying to do ...');
        throw new Error('Boom!');
      });
      it('work in progress');
      it('even more to be done');
    });
  });
});
