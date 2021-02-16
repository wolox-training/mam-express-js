const axios = require('axios');
const { getRandomJoke } = require('../../app/services/weet');

jest.mock('axios');

describe('Testing implementation of API integration', () => {
  it('Check if a joke is returned', async () => {
    axios.get.mockResolvedValue({
      data: {
        joke: 'Chuck Norris doesnt use a computer because a computer does everything slower than Chuck Norris'
      }
    });

    const randomJoke = await getRandomJoke();
    expect(randomJoke).toHaveProperty('joke');
    expect(randomJoke.joke).toEqual(
      'Chuck Norris doesnt use a computer because a computer does everything slower than Chuck Norris'
    );
  });
});
