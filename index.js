const express = require('express')
var bodyParser = require('body-parser')
const supabaseClient = require('@supabase/supabase-js')
const app = express()
const port = 3000;
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

const supabaseUrl = 'https://neezehpuzbugwhnnjltb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lZXplaHB1emJ1Z3dobm5qbHRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI4NTEzMDMsImV4cCI6MjAxODQyNzMwM30.ypw42z9JXz0A2RIE71w9yao78063o9ZZKofihKr2A4I';
const supabase = supabaseClient.createClient(supabaseUrl, supabaseKey);
const db = 'comments';

app.get('/', (req, res) => {
    res.sendFile('public/index.html', { root: __dirname })
})

app.get('/about', (req, res) => {
    res.sendFile('public/about.html', { root: __dirname })
})

app.get('/comments', async (req, res) => {
    const {data, error} = await supabase.from(db).select();
    if(error) console.log(error)
    else if(data) res.send(data)
})

app.post('/comment', async (req, res) => {
    var name = req.body.name, comment = req.body.comment;

    const {data, error} = await supabase.from(db)
        .insert([{'name': name, 'comment': comment}])
        .select();

    res.header('Content-type', 'application/json');
    res.send(data);
})

app.listen(port, () => {
    console.log('App deployed...')
})