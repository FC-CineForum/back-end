from Miner import mine_entry
import sys

def run():
    '''
    minero de entradas usando los argumentos de entrada:

    - Parameters:
        - args[1]: 0 o 1 dependiendo si es película o serie respectivamente
        - args[2]: el link a minar
    '''
    args = sys.argv

    if args[1] in ('0', '1'):
        if(args[1] == '0'):
            mine_entry(args[2], 'mv')
        else:
            mine_entry(args[2], 'sr')

run()
