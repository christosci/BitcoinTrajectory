import sys
import csv
import struct
from constants import *
from process_data import *
from datetime import datetime
from dateutil.relativedelta import relativedelta
from calendar import monthrange

def parse_headers():
    """
    convert binary file http://headers.electrum.org/blockchain_headers to CSV ASCII
    """
    STRUCT_OF_BLOCK = [ 4, 32, 32, 4, 4, 4 ] # blockchain_headers does not contain always "0x00" txn_count
    BLOCK_SIZE = sum(STRUCT_OF_BLOCK)

    FILE_OUT = open('blockchain_headers.csv','w')

    FILE_OUT.write( "version,prev_block,merkle_root,timestamp,bits,nonce,txn_count\n" )

    with open(BLKHDRS_RAW,'rb') as FILE:
        block = FILE.read(BLOCK_SIZE)
        while block != b'':
            position = 0
            for idx, i in enumerate(STRUCT_OF_BLOCK):
                field = block[position:(position+i)][::-1]
                if idx == 0 or idx >= 3:
                    FILE_OUT.write(str(struct.unpack(">L", field)[0]) + ',')
                else:
                    FILE_OUT.write(field.hex() + ',')
                position += i
                if position >= BLOCK_SIZE:
                    FILE_OUT.write("00\n") # blockchain_headers does not contain always "0x00" txn_count
            block = FILE.read(BLOCK_SIZE)

def calculate_monthly_supply():
    """"
    Calculate total supply for every month since genesis block.
    Extrapolate supply into the future assuming block time of 10 minutes.
    """
    data = [] 
    HALVINGS_ARR = json_to_x(HALVINGS)
    i = 0
    block_reward = 50
    closing_date = datetime(2009, 2, 1, 0, 0)
    num_btc = 0
    with open(BLKHDRS) as f:
        csv_reader = csv.reader(f, delimiter=',')
        next(csv_reader) # skip csv header
        for row in csv_reader:
            timestamp = int(row[3])
            date = datetime.fromtimestamp(timestamp)
            if timestamp > int(HALVINGS_ARR[i]):
                i+=1
                block_reward /= 2
            
            num_btc += block_reward
            
            if date > closing_date:
                data.append({'x': int(datetime.timestamp(closing_date)), 'y': num_btc})
                closing_date += relativedelta(months = +1)
    
    # extrapolate monthly supply into the future
    while (closing_date < datetime(2030, 1, 1, 0, 0)):
        if i < len(HALVINGS_ARR) and datetime.timestamp(closing_date) > int(HALVINGS_ARR[i]):
            i+=1
            block_reward /= 2
        num_btc += monthrange(closing_date.year, closing_date.month)[1] * block_reward * 144
        data.append({'x': int(datetime.timestamp(closing_date)), 'y': num_btc})
        closing_date += relativedelta(months = +1)
    
    write_to_json(MONTHLY_SUPPLY, {'values': data})


if __name__ == "__main__":
    arg = sys.argv[1]

    if arg == 'parse_headers':
        parse_headers()
    elif arg == 'monthly_supply':
        calculate_monthly_supply()
