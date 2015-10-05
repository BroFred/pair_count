demo/test in the test.js
This piece of code runs in 
1.stdin mode by using node index < exapmle.txt > res.txt
2.module(file) mode: 
basically co-occur.js export a function which take two parameters
file directory and callback function(callback(res) res is the result)




Toughts:
1.get rid of duplicate elements
2.sort every line of input O(mlogm)
3.produece combination pair of each line m^2/2 which(A<B) note: if unsorted will be m^2 O(m^2/2)
4.give each factory unqiue number and convert pair to hash number(Cantor pairing function:pi(k1, k2) = 1/2(k1 + k2)(k1 + k2 + 1) + k2);
5.put pair hash to one dictionaty
6.inspect dictionary get results
over all O((mlogm+m^2/2)*n)

concerns:
1.duplicate input like “AABBCC”
2.unsorted input like "CDACB"
3.extra space in front or end of every element