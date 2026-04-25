const axios = require('axios');

async function testQuizAPI() {
  try {
    // Test GET
    console.log('\n✅ Testing GET /api/quiz');
    const getRes = await axios.get('http://localhost:5000/api/quiz');
    console.log('Existing questions:', getRes.data.length);
    
    // Test POST
    console.log('\n✅ Testing POST /api/quiz');
    const postRes = await axios.post('http://localhost:5000/api/quiz', {
      question: 'What is your favorite eco-friendly practice?',
      options: ['Recycling', 'Composting', 'Renewable energy', 'All of the above'],
      answer: 'All of the above'
    });
    console.log('Response:', postRes.data);
    
    // Test GET again
    console.log('\n✅ Testing GET again');
    const getRes2 = await axios.get('http://localhost:5000/api/quiz');
    console.log('Questions after add:', getRes2.data.length);
    
    console.log('\n✅ All tests passed!');
  } catch (err) {
    console.error('❌ Error:', err.response?.data || err.message);
  }
}

testQuizAPI();
