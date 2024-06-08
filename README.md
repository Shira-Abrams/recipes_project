url	description	method	permissions	parameters	body	returns	optional parameters	CRUD Operation	errors	headers
כתובת	תאור	method	הרשאות	פרמטרים	body	מה מחזיר	פרמטרים אופציונליים	CRUD Operation	מקרי קיצון - מה השרת מחזיר אז	headers
/api/course	שליפת כל הקורסים	get		-	-	course[]	search - חיפוש לפי שם קורס	READ		Authorization
						[ {_id: string, name: string, price: number, numLessons: number, tags: [string], speaker: { firstName: string, lastName: string }, startDate: Date } ]	page - מס' עמוד			
							perPage - מס' קורסים לעמוד			
/api/course/{id}	שליפת קורס לפי קוד	get		{id} – קוד קורס	-	{_id,name,price,numLessons	-	READ	...	
						,tags:[],speaker:{firstName,lastName},startDate}				
/api/course	מוסיף קורס חדש למסד הנתונים ומחיזר אותו	post		-	{name,price,numLessons	{_id,name,price,numLessons	-	CREATE	אם חסרים שם או מחיר יחזיר קוד 404...	
					,tags:[],speaker:{firstName,lastName},startDate}	,tags:[],speaker:{firstName,lastName},startDate}				
/api/course/{id}	מוחק קורס ממסד הנתונים ומחזיר אותו לאחר המחיקה	 delete		{id} – קוד קורס	-	{_id,name,price,numLessons	-	DELETE	אם לא קיים קורס כזה מחזיר קוד 404 , אם הקוד לא ייתכן מחזזח...	
						,tags:[],speaker:{firstName,lastName},startDate				
/api/course/{id}	מעדכן פרטי קורס ומחזיר את הקורס לאחר העדכון	Put		{id} – קוד קורס	{name,price,numLessons	{_id,name,price,numLessons	-	UPDATE	אם	
					,tags:[],speaker:{firstName,lastName},startDate}	,tags:[],speaker:{firstName,lastName},startDate}				
