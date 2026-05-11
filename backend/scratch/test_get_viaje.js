const axios = require('axios');

async function testGet() {
    try {
        const res = await axios.get('http://localhost:3000/api/viajes/1');
        console.log('Success:', JSON.stringify(res.data, null, 2));
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

testGet();
