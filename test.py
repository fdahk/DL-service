class Solution(object):
    def deleteDuplicateFolder(self, paths):
        tree = defaultdict(list) 
        for i in paths: 
            for j in range(1,len(i)) :
                tree[j-1].append(i[j]) 
                
