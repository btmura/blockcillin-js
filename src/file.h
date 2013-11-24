#ifndef BLOCKCILLIN_FILE_H_
#define BLOCKCILLIN_FILE_H_

#include <string>

class File {
 public:
  static bool ReadFile(const std::string &path, std::string *contents);
};

#endif // BLOCKCILLIN_FILE_H_
