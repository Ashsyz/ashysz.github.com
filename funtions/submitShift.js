// functions/submitShift.js
const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
    const supabaseUrl = process.env.SUPABASE_DATABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { staffName, selectedShifts } = JSON.parse(event.body);

    try {
        // Upsert selected shifts into the Supabase table
        const { data, error } = await supabase
            .from('shifts')
            .upsert(selectedShifts.map(shift => ({
                ...shift,
                available_staffs: [staffName],
            })));

        if (error) throw error;

        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
