import { Switch, TextField, Typography, FormControlLabel } from '@mui/material';

export default function PremiumEntry({ isPremium, handlePremiumToggle, coins, handleChange }) {
    return (
        <div className='flex gap-6 items-start'>
            {/* Left: Premium Toggle */}
            <div className='flex flex-col items-center gap-3'>
                <FormControlLabel
                    control={
                        <Switch
                            checked={isPremium}
                            onChange={handlePremiumToggle}
                            color='primary'
                        />
                    }
                    label='Is Premium'
                />
            </div>

            {/* Right: Coins Input (only if premium is true) */}
            {isPremium && (
                <div className='flex flex-col gap-2'>
                    <Typography variant='body1' className='font-semibold'>
                        Deduct Coins For Entry
                    </Typography>
                    <TextField
                        label='Enter Coins'
                        variant='outlined'
                        size='small'
                        name='coins'
                        value={coins || ''}
                        onChange={handleChange}
                        sx={{ width: 200 }}
                    />
                    <Typography variant='caption' className='text-gray-500'>
                        * Only required if premium is active
                    </Typography>
                </div>
            )}
        </div>
    );
}
