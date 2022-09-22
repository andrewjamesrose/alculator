// https://www.nhs.uk/live-well/alcohol-advice/the-risks-of-drinking-too-much/#:~:text=men%20and%20women%20are%20advised,drink%2Dfree%20days%20each%20week

export const MAX_7_DAY_TOTAL = 14

export const MIN_SPREAD_DAYS = 3

export const MAX_DAILY = MAX_7_DAY_TOTAL/MIN_SPREAD_DAYS

export const DRINK_NAMED_VOLUMES = [
    {   displayString:  "Large Wine", 
        volume:         250
    },
    {   
        displayString:  "Medium Wine", 
        volume:         175
    },
    {   
        displayString:  "Small Wine", 
        volume:         125
    },
    {
        displayString:  "1/3 Pint", 
        volume:         189
    },
    {
        displayString:  "1/2 Pint", 
        volume:         284  
    },
    {
        displayString:  "2/3 Pint", 
        volume:         379
    },
    {
        displayString:  "Pint", 
        volume:         568
    },
    {
        displayString:  "Can", 
        volume:         250
    },
    {
        displayString:  "Can", 
        volume:         330
    },
    {
        displayString:  "Can", 
        volume:         440
    },
    {
        displayString:  "Beer Bottle", 
        volume:         500
    },
    {
        displayString:  "1/4 Wine Bottle", 
        volume:         187
    },
    {
        displayString:  "1/3 Wine Bottle", 
        volume:         250   
    },
    {
        displayString:  "1/2 Wine Bottle", 
        volume:         375
    },
    {
        displayString:  "Wine Bottle", 
        volume:         750
    }
]