import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { DailyProgress } from '../Types/types';
import { LocalFireDepartment } from '@mui/icons-material';

interface StreakDonutProps {
  progress: DailyProgress[];
  currentStreak: number;
}

export const StreakDonut: React.FC<StreakDonutProps> = ({
  progress,
  currentStreak
}) => {
  const theme = useTheme();

  const calculateStats = () => {
    const successCount = progress.filter(p => p.status === 'success').length;
    const failureCount = progress.filter(p => p.status === 'failure').length;
    const totalCount = successCount + failureCount;
    
    return [
      { 
        name: 'Success', 
        value: successCount,
        percentage: totalCount ? Math.round((successCount / totalCount) * 100) : 0
      },
      { 
        name: 'Missed', 
        value: failureCount,
        percentage: totalCount ? Math.round((failureCount / totalCount) * 100) : 0
      }
    ];
  };

  const data = calculateStats();
  const COLORS = [theme.palette.success.main, theme.palette.error.main];

  return (
    <Box sx={{ 
      mt: 4, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      position: 'relative'
    }}>
      <Box sx={{ 
        width: '100%', 
        height: 300,
        position: 'relative'
      }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              innerRadius="60%"
              outerRadius="80%"
              paddingAngle={5}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((_entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index]}
                  strokeWidth={0}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Content */}
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
          <LocalFireDepartment 
            sx={{ 
              fontSize: 32, 
              color: theme.palette.warning.main,
              mb: 1
            }} 
          />
          <Typography variant="h3" sx={{ 
            fontWeight: 'bold',
            color: theme.palette.text.primary
          }}>
            {currentStreak}
          </Typography>
          <Typography variant="subtitle1" sx={{ 
            color: theme.palette.text.secondary,
            mt: -1
          }}>
            Day Streak
          </Typography>
        </Box>
      </Box>

      {/* Stats Legend */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: 4, 
        mt: 2,
        flexWrap: 'wrap'
      }}>
        {data.map((entry, index) => (
          <Box 
            key={entry.name} 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1 
            }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: COLORS[index],
              }}
            />
            <Typography variant="body2">
              {entry.name}: {entry.value} ({entry.percentage}%)
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};