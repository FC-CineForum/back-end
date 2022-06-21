from aenum import MultiValueEnum


class Classification(MultiValueEnum):
    A = 'A', 'AA', 'U', 'PG', 'TV-G', 'TV-PG', 'G', '7', 'GP', 'TV-Y7'
    B = 'B', 'PG-13', '13', 'M', 'TV-14'
    B15 = 'B15', 'TV-MA', 'R', 'MA15+', '15+', '15', '5+', 'B-15'
    C = 'C', 'NC-17', '17', '18+', 'Passed'
    NA = 'Not Rated', '', 'Approved', 'Unrated'
