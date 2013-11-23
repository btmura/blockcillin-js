#ifndef BLOCKCILLIN_FILE_H_
#define BLOCKCILLIN_FILE_H_

class File {
 public:
  static bool GetFileContents(const std::string &path, std::string *contents);
};

#endif // BLOCKCILLIN_FILE_H_
